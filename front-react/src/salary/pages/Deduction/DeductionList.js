import { Button, Container, Content, Divider, Header, Card } from "rsuite";
import Leftbar from "../../../common/pages/Leftbar";
import DeductionLeftbar from "./DeductionLeftbar";
import { useEffect, useState } from "react";
import DeductionModal from "./DeductionModal.";

const DeductionList = () => {
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const fetchList = () => {
        fetch("http://localhost:8081/api/deductions")
        .then(res => res.json())
        .then(data => setList(data));
    }

    useEffect(() => {
        fetchList();
    }, []);

    const handleDelete = (id) => {
        if(window.confirm("삭제하시겠습니까?")) {
            fetch(`http://localhost:8081/api/deduction/${id}`, {
                method: "DELETE"
            })
            .then(res => {
                if(res.ok) {
                    fetchList();
                } else {
                    alert("삭제 실패하였습니다")
                }
            })
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setOpen(true);
    }

    return(
     <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar/>
        <Container>
            <DeductionLeftbar
                onRegisterClick={() => {
                    setSelectedItem(null);
                    setOpen(true);
                }}
            />
            <Content>
            <Header />
            <Divider />
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>수당 관리</span>
                    </Card.Header>
                    <table className="board-table">
                        <thead>
                            <tr>
                            <th>항목명</th>
                            <th>공제율</th>
                            <th>고정금액</th>
                            <th>소득세</th>
                            <th>사용</th>
                            <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((row, index) => (
                            <tr key={index}>
                                <td>{row.name}</td>
                                <td>{row.rate ? `${row.rate}%` : "-"}</td>
                                <td>{row.fixed_amount ? `${row.fixed_amount.toLocaleString()} 원` : "-"}</td>
                                <td>{row.is_tax ? "O" : "X"}</td>
                                <td>{row.is_active ? "O" : "X"}</td>
                                <td>
                                    <Button
                                        size="xs"
                                        appearance="primary"
                                        style={{ marginRight: "5px" }}
                                        onClick={() => handleEdit(row)}
                                    >
                                        수정
                                    </Button>
                                    <Button
                                        size="xs"
                                        appearance="ghost"
                                        color="red"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        {open && (
                            <DeductionModal
                                open={open}
                                onClose={ () => setOpen(false)}
                                item={selectedItem}
                                onSuccess={fetchList}
                            />
                        )}
                </Card>
            </Content>
        </Container>
     </Container> 
    )
};
export default DeductionList;