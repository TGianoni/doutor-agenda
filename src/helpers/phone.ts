export const formatPhoneNumber = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");
  
  // Se tiver 11 dígitos (celular), formata como (##) #####-####
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  
  // Se tiver 10 dígitos (fixo), formata como (##) ####-####
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  
  // Se não tiver o tamanho esperado, retorna o original
  return phone;
};
