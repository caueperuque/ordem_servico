//Dados do cliente
/* 
     Nome
     CPF/CNPJ
     Inscrição/RG
     Endereço / bairro
     CEP
     Cidade - estado
  */

import { User } from "phosphor-react";
import { InputsDadosClienteContainer } from "./styles";
import { useEffect, useState } from "react";
import { consultarCep } from "../../../../helpers/functions";

export const InfoCliente = () => {
  const [cepField, setCepField] = useState<string>('');
  const [cityField, setCityField] = useState<string>('');
  const [addressField, setAddressField] = useState<string>('');
  const [stateField, setStateField] = useState<string>('');
  const [neighborhoodField, setNeighborhoodField] = useState<string>('');
  const [numberField, setNumberField] = useState<string>('');
  
  
  useEffect(() => {
    if(cepField.length === 8){
      consultarCep(cepField).then(({ logradouro, bairro, uf, localidade }) => {
        setAddressField(logradouro);
        setNeighborhoodField(bairro);
        setCityField(localidade);
        setStateField(uf);
        
      });
    }
  }, [cepField]);

  // console.log(cep);
  
  return (
    <InputsDadosClienteContainer>
      <header>
        <h3>Informações do cliente</h3>
        <User size={20} />
      </header>
      <div className="row">
        <div className="input-group">
          <label htmlFor="">Nome completo:</label>
          <input type="text" placeholder="Nome" />
        </div>
        <div className="input-group">
          <label htmlFor="">CPF / CNPJ:</label>
          <input type="text" placeholder="CPF ou CNPJ" />
        </div>
        <div className="input-group">
          <label htmlFor="">Inscrição / RG:</label>
          <input type="number" placeholder="Inscrição ou RG" />
        </div>
      </div>

      <div className="row">
        <div className="input-group">
          <label htmlFor="">CEP:</label>
          <input type="text" placeholder="CEP" value={cepField} onChange={(e) => setCepField(e.target.value)}/>
        </div>
        <div className="input-group">
          <label htmlFor="">Cidade:</label>
          <input type="text" placeholder="Placa" value={cityField} onChange={(e) => setCityField(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="">Estado:</label>
          <input type="text" placeholder="Estado" value={stateField} onChange={(e) => setStateField(e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="input-group">
          <label htmlFor="">Bairro:</label>
          <input type="text" placeholder="Bairro" value={neighborhoodField} onChange={(e) => setNeighborhoodField(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="">Endereço:</label>
          <input type="text" placeholder="Endereço" value={addressField} onChange={(e) => setAddressField(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="">Número:</label>
          <input type="text" placeholder="Número" value={numberField} onChange={(e) => setNumberField(e.target.value)} />
        </div>
      </div>
    </InputsDadosClienteContainer>
  );
};
