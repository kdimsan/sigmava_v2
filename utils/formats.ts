export const formatDate = (dateTime: string) => {
    if (!dateTime) return "Data inválida";
  
    const date = new Date(dateTime);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).replace(/\//g, ".");
  };
  
  export const formatTime = (dateTime: string) => {
    if (!dateTime) return "Hora inválida";
  
    const date = new Date(dateTime);
    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  