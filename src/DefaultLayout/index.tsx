import { Outlet } from "react-router-dom"
// import { Header } from "../../components/Header"
import { LayoutContainer } from "./styles"

export const DefaultLayout = () => {
    return (
        <LayoutContainer>
            {/* <Header /> */}
            <Outlet /> {/* Elemento onde entrará o conteúdo */}
        </LayoutContainer>
    )
}