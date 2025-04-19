import { Button, Container, Content, Divider, Header, Card } from "rsuite";
import Leftbar from "../../../common/pages/Leftbar";
import AllowanceLeftbar from "./AllowanceLeftbar";
import { useEffect, useState } from "react";
import AllowanceModal from "./AllowanceModal";

const AllowanceList = () => {
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchList = () => {
        fetch("http://localhost:8081/api/allowances")
        .then(res => res.json())
        .then(data => setList(data));
    }

    useEffect(() => {
        fetchList();
    }, []);

    const handleDelete = (id) => {
        if(window.confirm("삭제하시겠습니까?")) {
            fetch(`http://localhost:8081/api/allowance/${id}`, {
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
            <AllowanceLeftbar
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
                            <th>금액</th>
                            <th>고정</th>
                            <th>비과세</th>
                            <th>비과세 한도</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((row, index) => (
                            <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.fixed_amount?.toLocaleString()}원</td>
                            <td>{row.is_fixed ? "O" : "X"}</td>
                            <td>{row.is_tax_free ? "O" : "X"}</td>
                            <td>{row.tax_free_limit?.toLocaleString() || "0"}원</td>
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
                        <AllowanceModal
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
export default AllowanceList;