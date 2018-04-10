import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Particles from 'react-particles-js';
import Register from './components/register/Register';
import { Router, Route, Switch } from 'react-router';

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
			box: {},
			route: 'signin',
			isSignedIn: false
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		this.setState({box: box})
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value})
	}

	onButtonSubmit = () => {
		this.setState({ box: {} })
		this.setState({imageUrl: this.state.input})
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL, 
			this.state.input)
		.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
		.catch(err => console.log(err))
	}

	onRouteChange = (route) => {
		this.setState({route: route});
		if (route === "signin" || route === "register") {
			this.setState({isSignedIn: false})
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
	}

	render() { 
		const { isSignedIn, imageUrl, box, route } = this.state;
		return (
			<div className="App">
				<Particles
					className='particles'
					params={particleOptions}
				/>
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
				{ route === 'home'
				?
					<div>
						<Logo/>
						<Rank />
						<ImageLinkForm 
							onInputChange={this.onInputChange} 
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition imageUrl={imageUrl} box={box} />
					</div>
				: ( route === 'signin'
					?
						<Signin onRouteChange={this.onRouteChange} />
					:
						<Register onRouteChange={this.onRouteChange} />
					)
				
				}
			</div>
		);
	}
}

export default App;
