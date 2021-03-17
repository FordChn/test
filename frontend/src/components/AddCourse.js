import React ,{ useState ,useEffect  } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { Button ,Box, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useFileUpload } from "use-file-upload";
import Avatar from '@material-ui/core/Avatar';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
    filled: {
      background: "white",
      borderRadius: 10
    },
    paper: {
      padding: theme.spacing(5),
      margin : theme.spacing(3),
      color: theme.palette.text.secondary,
      backgroundColor: '#424242',
      borderRadius: 15
    },
    input: {
      display: 'none',
    },
    image: {
      margin : theme.spacing(3),
      width: theme.spacing(30),
      height: theme.spacing(30),
    },
    button: {
      margin : theme.spacing(3),
      width: theme.spacing(20),
      height: theme.spacing(7),
    },
    icon: {
      marginLeft : theme.spacing(2),
      marginRight : theme.spacing(2),
    }
}));

const initialCourseData = {
  name: "",
  attatch_photo: "",
  subject: "",
  description: "",
  price: "",
  link: ""
}

const subject = [
  {value: 'Mathematics',    label: 'Mathematics',},
  {value: 'Science',        label: 'Science',},
  {value: 'Social Studies', label: 'Social Studies',},
  {value: 'Language',       label: 'Language',},
  {value: 'Arts',           label: 'Arts',},
  {value: 'Other',          label: 'Other',},
];

function AddCourse() {

  const classes = useStyles();
  const [courseData, setCourseData] = useState(initialCourseData);
  const [errors, setErrors] = useState({});
  const [files, selectFiles] = useFileUpload();
  const defaultSrc = 
        "https://martialartsplusinc.com/wp-content/uploads/2017/04/default-image-620x600.jpg"
  const validate = (fieldValues = courseData) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required."
    if ('subject' in fieldValues)
      temp.subject = fieldValues.subject ? "" : "This field is required."
    if ('price' in fieldValues){
      temp.price = temp.price || fieldValues.price ? "" : "This field is required."
      temp.price = temp.price || (/^[0-9]{1,10}$/).test(fieldValues.price) ? temp.price : "Price should be integer."
      temp.price = temp.price || fieldValues.price.length < 6 ? temp.price : "Price is too expensive."
      temp.price = temp.price || fieldValues.price ? temp.price : "This field is required."
    }
    if ('link' in fieldValues)
      temp.link = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/).test(fieldValues.link) || !fieldValues.link ? "" : "URL is not valid."
    if ('attatch_photo' in fieldValues)
      temp.attatch_photo = files ? "" : "This field is required."
    setErrors({
        ...temp
    })

    if (fieldValues == courseData)
        return Object.values(temp).every(x => x == "")
  }

  useEffect(() => {
    files ? validate({ attatch_photo: files}) : validate({ desc: ""} )
  }, [files]);


  const handleChangeInput = e => {
    const {name, value} = e.target
    setCourseData({
      ...courseData,
      [name]: value
    })
    validate({ [name]: value })
  }

  const handleSubmit = e => {

    e.preventDefault()
    
    if(validate()){
      //await new Promise(resolve => setTimeout(resolve, 2000));
      window.alert(JSON.stringify({context:'Creating Course',courseData: courseData, attatch_photo:files }, null, 2));
      axios
          .post("http://localhost:4000/register/course", {courseData: courseData, attatch_photo:files }, { crossdomain: true })
          .then(response => {
              /*console.log("response: ", response)
              var isSuccess = response.data.result;
              if(isSuccess){
               alert(`Course Registered !!!`);
               window.location.href = "/course";
              }else{
               alert(`Register Failed\n${response.data.error}`);
              }*/
              alert(JSON.stringify(response, null, 2));
          })
          .catch(err => {
              console.error(err)
          })
      }else{
        window.alert('Information not valid', JSON.stringify(courseData, null, 2));
      }
  }

  return (
    <Grid
      container
      //direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Typography variant="h2" color='primary' gutterBottom>
          Create Course
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Paper className = {classes.paper} variant="outlined" component='div' elevation={3}>
          <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container justify="space-around" alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Avatar 
                    className = {classes.image}
                    src={files?.source || defaultSrc} alt="preview" 
                    onChange = { () => { validate({ attatch_photo : files })} }/>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={1} direction="column" justify="space-between" alignItems="center">
                      <Grid item>
                        <input 
                          accept="image/*" 
                          className={classes.input} 
                          id="icon-button-file" 
                          type="file" 
                          value={courseData.attatch_photo} 
                          onChange = { () => { validate({ attatch_photo : files })} }
                        />
                        <label htmlFor="icon-button-file" color="primary" >
                          <IconButton color="primary" aria-label="upload picture" component="span" variant="contained" 
                            onClick = { () => { 
                              selectFiles({ accept: "image/*" }, ({ name, size, source, file }) => {
                                console.log("Files Selected", { name, size, source, file });
                              })
                              //.then( () => {validate({ attatch_photo : files })} )

                            }}
                          >  
                            <PhotoCamera fontSize="large" className={classes.icon}/>
                            <div> Upload Course Photo  </div>
                          </IconButton>
                        </label>
                      </Grid>
                      <Grid item>
                        <TextField 
                        disabled
                        label = {errors.attatch_photo ? "Error" : ""}
                        {...(errors.attatch_photo && {error:true,helperText:errors.attatch_photo})}
                        />
                      </Grid>
                    </Grid>
                    
                  </Grid>
                </Grid>
                <br/><br/>
                <Grid item xs={12}>
                  <TextField
                    className={classes.filled}
                    label = "Course Name"
                    value = {courseData.name}
                    name = "name"
                    variant="filled"
                    onChange={handleChangeInput}
                    fullWidth
                    {...(errors.name && {error:true,helperText:errors.name})}
                  />
                </Grid>
                <Grid container spacing={3} justify="space-between">
                  <Grid item xs={5}>
                    <TextField
                      className={classes.filled}
                      variant="filled"
                      label = "Course Price"
                      placeholder="1000"
                      name = "price"
                      onChange={handleChangeInput}
                      value = {courseData.price}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Bath</InputAdornment>,
                      }}
                      {...(errors.price && {error:true,helperText:errors.price})}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      variant="filled"
                      className={classes.filled}
                      label="Select Course Subject"
                      name = "subject"
                      onChange={handleChangeInput}
                      value={courseData.subject}
                      {...(errors.subject && {error:true,helperText:errors.subject})}
                    >
                      {subject.map(option => (
                        <MenuItem className={classes.filled} key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.filled}
                    multiline 
                    rows = "4"
                    variant="filled"
                    label = "Course Description"
                    placeholder="Course Description"
                    name = "desc"
                    onChange={handleChangeInput}
                    value = {courseData.description}
                    rowsMax={5}
                    fullWidth
                    {...(errors.desc && {error:true,helperText:errors.desc})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.filled}
                    label = "Link to your course material (Link or Drive)"
                    name = "link"
                    onChange={handleChangeInput}
                    value = {courseData.link}
                    variant="filled"
                    fullWidth
                    {...(errors.link && {error:true,helperText:errors.link})}
                  />
                </Grid>
                <br/><br/>
                <Grid
                  container
                  direction="column"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      <Typography component="div"> Upload Course Video </Typography>
                      <CloudUploadOutlinedIcon className={classes.icon}></CloudUploadOutlinedIcon>
                    </Button>
                  </Grid>
                  <Grid item xs={3}>

                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      size="large"
                      text="Submit"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>

          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AddCourse