// interface Inputs {
//   nome: string;
//   cpfCnpj: string;
//   inscricaoRg: string;
//   cep: string;
//   endereco: string;
//   bairro: string;
//   cidade: string;
//   estado: string;
//   numero: string;
// }

import { User } from "phosphor-react";
import { InputsDadosClienteContainer } from "./styles";
import { useEffect, useState } from "react";
import { consultarCep } from "../../../../helpers/functions";

export const InfoCliente = ({ register }) => {
  const [cepField, setCepField] = useState<string>("");
  const [cityField, setCityField] = useState<string>("");
  const [addressField, setAddressField] = useState<string>("");
  const [stateField, setStateField] = useState<string>("");
  const [neighborhoodField, setNeighborhoodField] = useState<string>("");
  const [numberField, setNumberField] = useState<string>("");

  useEffect(() => {
    const fetchCEP = async () => {
      if (cepField.length === 8) {
        const { logradouro, bairro, uf, localidade } =
          await consultarCep(cepField);

        setAddressField(logradouro);
        setNeighborhoodField(bairro);
        setCityField(localidade);
        setStateField(uf);
      }
    };

    fetchCEP();
  }, [cepField]);

  return (
    <InputsDadosClienteContainer>
      <header>
        <h3>Informações do cliente</h3>
        <User size={20} />
      </header>

      <div className="row">
        <div className="input-group" style={{ width: "30%" }}>
          <label htmlFor="nome">Nome completo:</label>
          <input
            {...register("nome")}
            type="text"
            placeholder="Nome"
            id="nome"
          />
        </div>

        <div className="input-group" style={{ width: "25%" }}>
          <label htmlFor="cpfCnpj">CPF / CNPJ:</label>
          <input
            {...register("cpfCnpj")}
            type="text"
            placeholder="CPF ou CNPJ"
            id="cpfCnpj"
          />
        </div>

        <div className="input-group" style={{ width: "25%" }}>
          <label htmlFor="inscricaoRg">Inscrição / RG:</label>
          <input
            {...register("inscricaoRg")}
            type="text"
            placeholder="Inscrição ou RG"
            id="inscricaoRg"
          />
        </div>
      </div>

      <div className="row">
        <div className="input-group">
          <label htmlFor="cep">CEP:</label>
          <input
            type="text"
            placeholder="CEP"
            id="cep"
            {...register("cep")}
            value={cepField}
            onChange={(e) => setCepField(e.target.value.replace(/\D/g, ""))}
            maxLength={8}
          />
        </div>

        <div className="input-group">
          <label htmlFor="cidade">Cidade:</label>
          <input
            {...register("cidade")}
            type="text"
            placeholder="Cidade"
            id="cidade"
            value={cityField}
            onChange={(e) => setCityField(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="estado">Estado:</label>
          <input
            {...register("estado")}
            type="text"
            placeholder="Estado"
            id="estado"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bairro">Bairro:</label>
          <input
            type="text"
            {...register("bairro")}
            placeholder="Bairro"
            id="bairro"
            value={neighborhoodField}
            onChange={(e) => setNeighborhoodField(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="endereco">Endereço:</label>
          <input
            type="text"
            {...register("endereco")}
            placeholder="Endereço"
            id="endereco"
            value={addressField}
            onChange={(e) => setAddressField(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            {...register("numero")}
            placeholder="Número"
            id="numero"
            value={numberField}
            onChange={(e) => setNumberField(e.target.value)}
          />
        </div>
      </div>
    </InputsDadosClienteContainer>
  );
};
