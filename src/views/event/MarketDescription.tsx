import React from 'react'

const MarketDescription: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').map((_line, index) => (
        <React.Fragment key={index}>
            {_line}
            <br />
        </React.Fragment>
    ))

    return <div>{lines}</div>
}

export default MarketDescription
