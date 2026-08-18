import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/posts/';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // READ - Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_URL}${editingId}/`, { title, content });
        setEditingId(null);
      } else {
        // CREATE
        await axios.post(API_URL, { title, content });
      }
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // EDIT - Populate form
  const handleEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>Django REST + React Blog (CRUD)</h1>

      {/* CREATE / UPDATE FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{editingId ? 'Edit Post' : 'Create New Post'}</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', marginRight: '10px', cursor: 'pointer' }}>
          {editingId ? 'Update Post' : 'Add Post'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>

      {/* READ / LIST POSTS */}
      <h2>All Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '15px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
            <p style={{ color: '#555' }}>{post.content}</p>
            <small style={{ color: '#888' }}>
              Created at: {new Date(post.created_at).toLocaleString()}
            </small>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleEdit(post)} style={{ marginRight: '8px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)} style={{ color: 'red', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;