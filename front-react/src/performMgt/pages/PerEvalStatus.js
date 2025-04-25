import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap";
import Leftbar from "../../common/pages/Leftbar";
import LeftbarDEvaluation from "../components/LeftbarDEvaluation";
import { Content, Button, Container} from "rsuite";
import { useUser } from '../../common/contexts/UserContext';

const PerEvalStatus = () => {

    const { user } = useUser();

    


    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <LeftbarDEvaluation />
                <Content>
                    <div>
                        <Card align="center">
                            <h5 className="line"> 평가 현황 </h5>
                            
                            <Card className='eval-card'>
                                {/* 상단 상태 표시 */}
                                <Card.Header style={{ display: 'flex', justify: 'end' }}>
                                    <span>
                                        대시보드
                                    </span>
                                </Card.Header>

                                {/* 본문 */}
                                <Card.Body className="p-4 space-y-2">
                                    <p style={{ fontWeight: '600', fontSize: '16px' }}>
                                        대시보드
                                    </p>

                                </Card.Body>

                                {/* 하단 버튼 */}
                                <Card.Footer>
                                    <Button>
                                        자세히 보러가기???
                                    </Button>
                                </Card.Footer>
                            </Card>

                        </Card>
                    </div>
                </Content>
            </Container>
        </Container >
    )
}
export default PerEvalStatus;