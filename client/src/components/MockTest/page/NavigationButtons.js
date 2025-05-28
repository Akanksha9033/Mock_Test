const NavigationButtons = ({ currentQuestionIndex, setCurrentQuestionIndex, totalQuestions, handleNext }) => {
    return (
        <div className="d-flex justify-content-between mt-3">
            <button
                className="btn btn-secondary"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestionIndex === 0}
            >
                Previous
            </button>

            <button
                className="btn btn-primary"
                onClick={handleNext} // ✅ Use the new next handler
                disabled={currentQuestionIndex === totalQuestions - 1 && !handleNext}
            >
                Next
            </button>
        </div>
    );
};

export default NavigationButtons;
