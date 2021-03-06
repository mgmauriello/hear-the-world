import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class SoundscapeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      marker: {}
    };

    this.setMarker = this.setMarker.bind(this);
    this.fileInputRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  setMarker(marker) {
    this.setState({ marker });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { title, description } = this.state;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('lat', this.props.marker.lat);
    formData.append('lng', this.props.marker.lng);
    formData.append('audio', this.fileInputRef.current.files[0]);
    const req = {
      method: 'POST',
      body: formData
    };

    fetch('/api/uploads', req)
      .then(res => res.json())
      .then(marker => {
        this.props.addSoundscapeMarker(marker);
        this.setState({
          title: '',
          description: '',
          marker: {},
          error: ''
        });
        this.fileInputRef.current.value = null;
        this.props.setModal(false);

      })
      .catch(err => console.error('Fetch Failed!', err));
  }

  render() {
    const { handleChange, handleSubmit } = this;

    return (
      <Form onSubmit={handleSubmit}>
        <Form.Label className="mt-2" htmlFor='title'>
          Title
        </Form.Label>
        <Form.Control
          required
          autoFocus
          id='title'
          type='text'
          name='title'
          value={this.state.title}
          placeholder='Enter Title'
          onChange={handleChange}
        />
        <Form.Label>Add Soundscape</Form.Label>
        <Form.Control
          required
          id='mp3File'
          type='file'
          name='audio'
          ref={this.fileInputRef}
          accept="audio/mp3,audio/*;capture=microphone"
          size='sm'
        />
        <Form.Label htmlFor='description'>
          Description or Information
        </Form.Label>
        <Form.Control
          className='mb-3'
          as="textarea"
          rows={3}
          id='description'
          name='description'
          value={this.state.description}
          placeholder='Description of Soundscape...'
          onChange={handleChange}
        />
        <Button variant="success" size='sm' type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}
