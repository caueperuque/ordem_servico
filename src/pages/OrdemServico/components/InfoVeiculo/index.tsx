// Informações veículo
// Marca
// Modelo
// Ano
// Motor
// Plcaca
// KM

import { Car } from "phosphor-react";
import { InputsInfoVeiculoContainer } from "./styles";

export const InfoVeiculo = () => {
  return (
    <InputsInfoVeiculoContainer>
      <header>
        <h3>Informações do veículo</h3>
        <Car size={20} />
      </header>
      <div className="row">
        <div className="input-group">
          <label htmlFor="">Marca:</label>
          <input type="text" placeholder="Marca" />
        </div>
        <div className="input-group">
          <label htmlFor="">Modelo:</label>
          <input type="text" placeholder="Modelo" />
        </div>
        <div className="input-group">
          <label htmlFor="">Ano:</label>
          <input type="number" placeholder="Ano" />
        </div>
      </div>

      <div className="row">
        <div className="input-group">
          <label htmlFor="">Motor:</label>
          <input type="text" placeholder="Motor" />
        </div>
        <div className="input-group">
          <label htmlFor="">Placa:</label>
          <input type="text" placeholder="Placa" />
        </div>
      </div>
    </InputsInfoVeiculoContainer>
  );
};
