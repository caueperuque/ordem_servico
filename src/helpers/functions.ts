interface ResultConsultarCep {
  cep: string
  logradouro: string
  bairro: string
  uf: string
  localidade: string
  erro?: string
}

export const consultarCep = async (cep: string): Promise<ResultConsultarCep> => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
  const dadosCep = await response.json();

  return dadosCep;
};
