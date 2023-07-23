import {
  AppBar,
  Box,
  Container,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar
} from "@mui/material"
import {useState, useEffect} from "react"
import { Add, Search, Delete } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid"
import {api} from "./api"
import {faker} from "@faker-js/faker"

const columns = [
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    minWidth: 150,
  },
  {
    field: "author",
    headerName: "Author",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "content",
    headerName: "Content",
    flex: 1,
    minWidth: 150,
  },
]

const TopMenu = () => {
  return (
    <Box sx={{ flexGrow: 1, mb: 1 }}>
      <AppBar position="static">
        <Toolbar />
      </AppBar>
    </Box>
  )
}
const EditMenu = (props) => {
  return (
    <div>
      <Button
        startIcon={<Add />}
        variant="contained"
        sx={{ my: 1, mr: 1 }}
        onClick={props.addPost}
      >
        Add
      </Button>
      <Button
        startIcon={<Delete />}
        variant="contained"
        
        disabled={!props.selection.length}
        sx={{ my: 1, mr: 1 }}
        onClick={() => props.removePosts(props.selection)}
        
      >
        Remove
      </Button>
    </div>
  )
}

function App() {
  const [posts, setPosts] = useState([])
  const [selection, setSelection] = useState([])
  const [query, setQuery] = useState("")

  const addPost = async () => {
    const post = {
      title: faker.lorem.lines(1),
      content: faker.lorem.paragraphs(3),
      author: faker.name.fullName(),
    }
    const response = await api.addPost(post)
    setPosts([...posts, { ...post, id: response._id }])
  }

  const removePosts = async (removedIds) => {
    setPosts(posts.filter((post) => !removedIds.includes(post.id)))
    await Promise.all(removedIds.map((id) => api.removePost(id)))
    
  }
  const search = async () => {
    const response = await api.search(query)
    setSelection(
      response.hits.hits.map((hit) => {
        return hit._id
      })
    )
    
  }

  useEffect(() => {
    api.getAllPosts().then(res => {
      setPosts(
        res.hits.hits.map((hit) => ({
          id: hit._id,
          ...hit._source,
        }))
      )
    })
        
  }, [])

  return (
    <>
      <TopMenu />
      <Container maxWidth="md">
        <TextField
          placeholder="Search"
          fullWidth
          value={query}
          onInput={(event) => setQuery(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment sx={{ pr: 1.5 }} position="start">
                <IconButton onClick={search}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
        <EditMenu
          selection={selection}
          addPost={addPost}
          removePosts={removePosts}
        />
        <div style={{ width: "100%" }}>
          <DataGrid
            autoHeight
            rows={posts}
            checkboxSelection={true}
            columns={columns}
            pageSize={100}
            onRowSelectionModelChange={(model) => setSelection(model)}
            rowSelectionModel={selection}
          />
        </div>
      </Container>
    </>
  )
}

export default App
