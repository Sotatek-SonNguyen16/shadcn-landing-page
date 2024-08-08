import React, { useState } from 'react'

const TelegramContent: React.FC = () => {
    const [message, setMessage] = useState<string>('')

    return (
        <div>
            <div>Telegram web app</div>
            <div className='p-3 flex gap-2 items-center'>
                <div>
                    <input
                        className='border-[1px] border-gray-500 rounded px-3 py-1'
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Type your message'
                    />
                </div>
            </div>
        </div>
    )
}

export default TelegramContent
