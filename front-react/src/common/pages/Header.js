import React from "react";
import { AutoComplete, IconButton, InputGroup, Nav, Tooltip, Whisper } from "rsuite";

import ExitIcon from '@rsuite/icons/Exit';
import SearchIcon from '@rsuite/icons/Search';
import { useUser } from "../contexts/UserContext";

const Header = () => {

    const { logout, user } = useUser();
    const styles = {
        width: 150,
        marginBottom: 10
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Nav style={{ display: "flex", justifyContent: "flex-end" }}>
            <InputGroup inside style={styles}>
                <AutoComplete />
                <InputGroup.Button tabIndex={-1}>
                    <SearchIcon />
                </InputGroup.Button>
            </InputGroup>


            {user && (
                <div style={{ position: 'relative' }}>
                    <IconButton
                        icon={<ExitIcon />}
                        appearance="subtle"
                        onClick={handleLogout}
                        style={{ marginLeft: 10 }}
                        title="로그아웃" // 기본 HTML 툴팁 사용
                    />
                </div>
            )}
        </Nav>
    );
};
export default Header;