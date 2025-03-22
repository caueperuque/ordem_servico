import { styled } from "styled-components";

export const OrdemServicoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
        background-color: ${props => props.theme['gray-900']};
        color: ${props => props.theme['gray-100']};
        border-radius: 8px;
        width: 100%;
        text-align: center;
        font-weight: bold;
    }
`

export const Separator = styled.div`
    width: 100%;
    /* background-color: red; */
    border: 1px solid ${props => props.theme['gray-600']};
    border-radius: 10px;
    margin-top: 2rem;
    margin-bottom: 2rem;
`