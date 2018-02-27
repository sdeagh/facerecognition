import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
	apiKey: 'b59782d5a0f547e5a5a96e3a55680856'
})

const particleOptions = {
	particles: {
		number: {
			value: 60,
			density: {
				enable: true,
				value_area: 800,
			}
		}
	}
}

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: '',
		}
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value})
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input})
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL, 
			this.state.input)
		.then(
			function(response) {
				// do something with response
				console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
			},
			function(err) {
				// there was an error
			}
		);
	}

	render() {
		return (
			<div className="App">
				<Particles
					className='particles'
					params={particleOptions}
				/>
				<Navigation/>
				<Logo/>
				<Rank />
				<ImageLinkForm 
					onInputChange={this.onInputChange} 
					onButtonSubmit={this.onButtonSubmit}
				/>
				<FaceRecognition imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
