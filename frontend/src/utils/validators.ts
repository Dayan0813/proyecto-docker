export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  password: (password: string): boolean => {
    return password.length >= 6;
  },

  number: (value: any): boolean => {
    return !isNaN(Number(value)) && Number(value) > 0;
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
