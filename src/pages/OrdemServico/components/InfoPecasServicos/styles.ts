import styled from "styled-components";

export const InfoPecasServicosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .row table {
    width: 100%;
    border-collapse: collapse;
  }

  .row th,
  .row td {
    text-align: left;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }

  .row td {
    :disabled {
      background-color: ${props => props.theme['gray-400']};
      color: ${props => props.theme['gray-300']};
      cursor: not-allowed;
      border-color: ${props => props.theme['gray-400']};
    }
  }

  .row th {
    font-weight: 600;
    font-size: 0.9rem;
    text-align: center;
  }

  .row th:nth-child(3),
  .row td:nth-child(3) {
    width: 35%;
  }

  .row th:last-child,
  .row td:last-child {
    div {
      display: flex;
    }
  }

  .row input,
  .row textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: border-color 0.3s ease;
  }

  .row input:focus,
  .row textarea:focus {
    border-color: ${props => props.theme['green-500']};
    outline: none;
  }

  .row button {
    padding: 0.5rem 1rem;
    background-color: ${props => props.theme['green-500']};
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .row button:hover {
    background-color: #0056b3;
  }

  #btn-edit {
    background-color: #0056b3;
  }

  #btn-remover {
    background-color: #E61919;
  }
`;
