
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Container, Content } from "rsuite";




const EvalList = () => {



    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <div>
                        

                    </div>
                </Content>
            </Container>
        </Container >

    )


}
export default EvalList;