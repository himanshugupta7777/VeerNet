import React, { useState } from "react";
import QuizSubjectSelector from "./components/QuizSubjectSelector";
import Quiz from "./Quiz";

const QuizPage = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  return selectedSubject ? (
    <Quiz subject={selectedSubject} />
  ) : (
    <QuizSubjectSelector onSelectSubject={setSelectedSubject} />
  );
};

export default QuizPage;