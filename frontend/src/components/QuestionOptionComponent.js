import React from 'react';

function QuestionOptionComponent({ question, options, selectedQO, onQOSelect }) {
  return (
    <div className="questionOptionsHead">
      <h1 className='questionOptionh1'>Question of the Day</h1>
      <p className='questionOptionp1'>{question}</p>

      <div className="questionoptions">
        {options.map((option, index) => (
          <div
            key={index}
            className={`questionoption ${selectedQO === option ? 'selected' : ''}`}
            onClick={() => onQOSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionOptionComponent;
