import React from 'react';

const KibanaDashboard = () => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
           <iframe src="http://localhost:5601/goto/2e1fd711ae743d0bb0ffff74344722b9" height="600" width="800"></iframe>
           <iframe src="http://localhost:5601/goto/9c8c4fafdfdb08de8576fd2820ecc242" height="600" width="800"></iframe>
        </div>
    );
};

export default KibanaDashboard;