$ErrorActionPreference = 'Continue'
$base = 'http://localhost:3000'

function Try-Invoke($script){
  try{ & $script } catch { Write-Host "ERROR: $_" -ForegroundColor Red }
}

Write-Host "== Comprobando GET /products =="
Try-Invoke { $res = Invoke-RestMethod -Method Get -Uri "$base/products"; $res | ConvertTo-Json -Depth 5 | Write-Host }

Write-Host "== Registrar admin (si no existe) =="
Try-Invoke { $body = @{name='admin'; email='admin@example.com'; password='123456'; role='admin'} | ConvertTo-Json; $res = Invoke-RestMethod -Method Post -Uri "$base/auth/register" -Body $body -ContentType 'application/json'; Write-Host ($res | ConvertTo-Json -Depth 5) }

Write-Host "== Login admin =="
$adminToken = $null
try{
  $body = @{email='admin@example.com'; password='123456'} | ConvertTo-Json
  $res = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -Body $body -ContentType 'application/json'
  $adminToken = $res.token
  Write-Host "Admin token: $($adminToken.Substring(0,20))..."
}catch{ Write-Host "Login admin failed: $_" -ForegroundColor Yellow }

if($adminToken){
  Write-Host "== Crear producto con admin (JSON) =="
  try{
    $body = @{ name='Test Product'; description='Descripción de prueba'; price='9.99'; quantity='10' } | ConvertTo-Json
    $res = Invoke-RestMethod -Method Post -Uri "$base/products/json" -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $adminToken" }
    Write-Host "Producto creado:"; $res | ConvertTo-Json -Depth 5 | Write-Host
  }catch{ Write-Host "Crear producto falló: $_" -ForegroundColor Yellow }
}

Write-Host "== Registrar usuario normal =="
Try-Invoke { $body = @{name='user'; email='user@example.com'; password='123456'} | ConvertTo-Json; $res = Invoke-RestMethod -Method Post -Uri "$base/auth/register" -Body $body -ContentType 'application/json'; Write-Host ($res | ConvertTo-Json -Depth 5) }

Write-Host "== Login usuario =="
$userToken = $null
try{
  $body = @{email='user@example.com'; password='123456'} | ConvertTo-Json
  $res = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -Body $body -ContentType 'application/json'
  $userToken = $res.token
  Write-Host "User token: $($userToken.Substring(0,20))..."
}catch{ Write-Host "Login user failed: $_" -ForegroundColor Yellow }

if($userToken){
  Write-Host "== Obtener productos y elegir uno para añadir al carrito =="
  try{
    $prods = Invoke-RestMethod -Method Get -Uri "$base/products"
    Write-Host ($prods | ConvertTo-Json -Depth 5)
    if($prods -and $prods.length -gt 0){
      $prodId = $prods[0].id
      Write-Host "Añadiendo producto id $prodId al carrito"
      $body = @{ productId = $prodId; quantity = 1 } | ConvertTo-Json
      $add = Invoke-RestMethod -Method Post -Uri "$base/cart/add" -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $userToken" }
      Write-Host "Carrito después de añadir:"; $add | ConvertTo-Json -Depth 5 | Write-Host

      Write-Host "== Ver carrito =="
      $cart = Invoke-RestMethod -Method Get -Uri "$base/cart" -Headers @{ Authorization = "Bearer $userToken" }
      Write-Host ($cart | ConvertTo-Json -Depth 5)

      if($cart.items -and $cart.items.Count -gt 0){
        $itemId = $cart.items[0].id
        Write-Host "== Eliminar item $itemId =="
        $rem = Invoke-RestMethod -Method Delete -Uri "$base/cart/item/$itemId" -Headers @{ Authorization = "Bearer $userToken" }
        Write-Host ($rem | ConvertTo-Json -Depth 5)
      }

      Write-Host "== Añadir otra vez y hacer checkout =="
      $body = @{ productId = $prodId; quantity = 1 } | ConvertTo-Json
      $add2 = Invoke-RestMethod -Method Post -Uri "$base/cart/add" -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $userToken" }
      Write-Host ($add2 | ConvertTo-Json -Depth 5)
      $checkout = Invoke-RestMethod -Method Post -Uri "$base/cart/checkout" -Headers @{ Authorization = "Bearer $userToken" }
      Write-Host "Checkout result:"; $checkout | ConvertTo-Json -Depth 5 | Write-Host
    } else { Write-Host "No hay productos para probar" }
  }catch{ Write-Host "Error en operaciones de carrito: $_" -ForegroundColor Yellow }
}

Write-Host "== Pruebas completadas =="
