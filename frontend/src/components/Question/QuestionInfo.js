import React , { useState, useEffect } from "react";
import { Box, Grid, makeStyles, Typography, Button, TextareaAutosize } from '@material-ui/core'
import AnswerCard from './AnswerCard'
import axios from 'axios'
import TextFieldSmall from "../TextFieldSmall";

const useStyles = makeStyles((theme) => ({
    typography: {
        color: '#FFFFFF',
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        background: theme.palette.background.default,
        color: '#FFF',
        '&:hover': {
            background: theme.palette.primary.main,
            color: '#000',
         },
    },
}));

export default function QuestionMore(props) {

    const classes = useStyles()
    const [isFollow, setIsFollow] = useState(false)
    const [answer, setAnswer] = useState('')
    const [result, setResult] = useState({
        description: '',
        creator: '',
        subject: '',
        topic: '',
        comment: [],
        follower: [],
    })

    const handleChangeAnswer = (key) => (event) => {
        setAnswer(event.target.value)
    }

    const handleFollow = () => {
        // axios.post("/question", {
        //     topic: topic,
        //     username: localStorage.getItem('username')
        // }).then(response => {
        //     console.log(response.data.description)
        //     if (response.data.description == "follow") {
        //         setIsFollow(true)
        //     } else {
        //         setIsFollow(false)
        //     }
        // }).catch(err => {
        //     console.error(err)
        // })
    }

    useEffect(() => {
        axios.get("http://localhost:4000/question_more", {
            params: {
                id: props.location.search.split('=')[1],
            },
        }).then(response => {
            setResult(response.data.result[0])
        }).catch(err => {
            console.error(err)
        })
    }, []);

    const answerCardList = (Array.from(Array(result.comment.length).keys())).map(index => {
        return (
            <AnswerCard content={result.comment[index]} username={result.writer[index]} mb={3}/>
        )
    })

    return (
        <>
            <Box mt={4} mb={1}>
                <Typography variant="h4" className={classes.typography}>
                    {result.topic}
                </Typography>
            </Box>
            <Box display="flex" bgcolor="background.light2" borderRadius={8} p={2} mt={4} mb={2}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="h6" className={classes.typography}>
                        by {result.creator}
                    </Typography>
                    <Typography variant="h6" className={classes.typography}>
                        Subject: {result.subject}
                    </Typography>
                </Box>
                <Box className={classes.grow} />
                <Box display="flex" flexDirection="column" alignItems="spacce-between" mb={4}>
                    <Button
                        variant={isFollow ? "contained" : "outlined"}
                        color={isFollow ? "primary" : "#000"}
                        onClick={handleFollow}
                        className={classes.button}
                    >
                        {isFollow ? 'Followed' : 'Follow'}
                    </Button>
                </Box>
            </Box>
            <Box display="flex" bgcolor="background.light2" borderRadius={8} minHeight="100px" p={3} mb={6}>
                <Typography variant="h6" className={classes.typography}>
                    {result.description}
                </Typography>
            </Box>
            <Typography variant="h4" className={classes.typography}>
                Comment ({result.comment.length})
            </Typography>
            {answerCardList}
            <Box display="flex" bgcolor="background.light2" borderRadius={8} flexDirection="column" p={4}>
                <Typography variant="h6" className={classes.typography} style={{marginBottom: 8}}>
                    Add a comment
                </Typography>
                <TextareaAutosize
                    value={answer}
                    onChange={handleChangeAnswer()}
                    style={{marginBottom: 16}}
                    height="300px"
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {console.log('yay')}}
                    className={classes.button}
                >
                    Submit
                </Button>
            </Box>
        </>
    )
}