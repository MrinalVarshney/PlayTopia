import React, { useRef, useEffect } from 'react';
import { styled } from '@mui/system';
import MessagesHeader from './MessagesHeader';
import { connect } from 'react-redux';
import Message from './Message';
import DateSeparator from './DateSeparator';
import CircularProgress from '@mui/material/CircularProgress';

const MainContainer = styled('div')({
  height: 'calc(100% - 60px)',
  overflowY: 'auto', // Use overflowY to enable vertical scrolling
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  
});

const convertDateToHumanReadable = (date, format) => {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
  };

  return format.replace(/mm|dd|yy|yyy/gi, (matched) => map[matched]);
};

const Messages = ({ chosenChatDetails, messages }) => {
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    // Scroll to the latest message when new messages arrive
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
   
  return (
    messages.length>0 ? 
    <MainContainer ref={messagesContainerRef}>
      <MessagesHeader name={chosenChatDetails?.name} profileImage={chosenChatDetails.profileImage} />
      {messages.map((message, index) => {
        const sameAuthor =
          index > 0 &&
          messages[index].author._id === messages[index - 1].author._id;

        const sameDay =
          index > 0 &&
          convertDateToHumanReadable(new Date(message.date), 'dd/mm/yy') ===
            convertDateToHumanReadable(
              new Date(messages[index - 1].date),
              'dd/mm/yy'
            );

        return (
          <div key={message._id} style={{ width: '97%' }}>
            {(!sameDay || index === 0) && (
              <DateSeparator
                date={convertDateToHumanReadable(
                  new Date(message.date),
                  'dd/mm/yy'
                )}
              />
            )}
            <Message
              content={message.content}
              username={message.author.username}
              sameAuthor={sameAuthor}
              userId={message.author._id}
              profileImage={message.author.profileImage}
              date={convertDateToHumanReadable(
                new Date(message.date),
                'dd/mm/yy'
              )}
              sameDay={sameDay}
            />
          </div>
        );
      })}
    </MainContainer>: <MainContainer style={{justifyContent: "center", height: "100vh", color:"white", fontsize:"24px" }}>
      Loading Messages...
    <CircularProgress />
</MainContainer>
  );
};

const mapStoreStateToProps = ({ chat }) => {
  return {
    ...chat,
  };
};

export default connect(mapStoreStateToProps)(Messages);
