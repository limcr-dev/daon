import React from 'react'
import { ClipLoader } from 'react-spinners';

const override = {
    color: "#BEB1E3",
    size: '15',
    cssOverride: 'null',
    speedMultiplier: '1'
};

const Loading = ({ loading }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <ClipLoader
                color="#BEB1E3"
                cssOverride={null}
                loading
                size={15}
                speedMultiplier={1}
            />
        </div>
    )
}

export default Loading;