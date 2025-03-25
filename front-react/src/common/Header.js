import React from "react";
import { AutoComplete, InputGroup, Nav } from "rsuite";

import ExitIcon from '@rsuite/icons/Exit';
import SearchIcon from '@rsuite/icons/Search';

const Header = () => {
    
    const styles = {
        width: 150,
        marginBottom: 10
      };

    return(
        <Nav style={{ display: "flex", justifyContent: "flex-end" }}>
           <InputGroup inside style={styles}>
                <AutoComplete />
                <InputGroup.Button tabIndex={-1}>
                    <SearchIcon />
                </InputGroup.Button>
            </InputGroup>
            <Nav.Item icon={<ExitIcon />}>나가기</Nav.Item>
        </Nav>
    );
};
export default Header;