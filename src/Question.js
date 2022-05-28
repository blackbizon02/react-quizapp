import React from "react";
import { nanoid } from 'nanoid';

export default function Question(props) {


    const btns = props.answers.map(answer => {


        let styles = {
            backgroundColor: answer.isHeld ? "#D6DBF5" : ""
        }

        if (props.showAnswers) {
            if (answer.isHeld && answer.isCorrect) {
                styles = { backgroundColor: "#94D7A2" };
            } else if (answer.isHeld && !answer.isCorrect) {
                styles = { backgroundColor: "#F8BCBC", opacity: "50%", border: 'none' };
            } else if (answer.isCorrect) {
                styles = { backgroundColor: "#94D7A2" }
            } else if (!answer.isCorrect) {
                styles = { opacity: "50%" }
            }
        }


        return <button
            className="btn-ques"
            key={nanoid()}
            onClick={() => props.updateHeld(props.id, answer.id)}
            style={styles}
        >{answer.value}</button>
    })

    return (
        <div className="ques">
            <h4>{props.question}</h4>
            <div className="unswers">
                {btns}
            </div>
        </div>
    )
}