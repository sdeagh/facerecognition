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
// import { Router, Route, Switch } from 'react-router';

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
			boxes: [],
			route: 'signin',
			isSignedIn: false,
			user: {
				id: -1,
				username: '',
				email: '',
				entries: -1,
				joined: ''
			}
		}
	}

	loadUser = (data) => {
		this.setState({ user: {
			id: data.id,
			username: data.username,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
	}

	calculateFaceLocation = (data) => {
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		let faceArray = []

		data.outputs[0].data.regions.forEach(face => {
			const clarifaiFace = face.region_info.bounding_box;
			faceArray.push(
				{
					leftCol: clarifaiFace.left_col * width,
					topRow: clarifaiFace.top_row * height,
					rightCol: width - (clarifaiFace.right_col * width),
					bottomRow: height - (clarifaiFace.bottom_row * height)
				}
			)
		})
		return faceArray;
	}

	displayFaceBoxes = (boxes) => {
		this.setState({boxes: boxes})
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value})
	}

	onImageSubmit = () => {
		this.setState({ box: {} })
		this.setState({imageUrl: this.state.input})
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL, 
			this.state.input)
		.then(response => {
			if (response) {
				fetch('https://facerecognition-sdesign.herokuapp.com/image', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({ id: this.state.user.id })
				})
				.then(response => response.json())
				.then(entries => {
					this.setState(Object.assign(this.state.user, { entries: entries }))
				})
				.catch(console.log)
			}
			this.displayFaceBoxes(this.calculateFaceLocation(response))
		})
		.catch(err => console.log(err))
	}

	onRouteChange = (route) => {
		this.setState({route: route});
		if (route === "signin" || route === "register") {
			this.setState({isSignedIn: false})
		} else if (route === 'home') {
			this.setState({ imageUrl: '' })
			this.setState({isSignedIn: true})
		}
	}

	render() { 
		const { isSignedIn, imageUrl, boxes, route } = this.state;
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
						<Rank name={ this.state.user.username } entries={ this.state.user.entries } />
						<ImageLinkForm 
							onInputChange={this.onInputChange} 
							onImageSubmit={this.onImageSubmit}
						/>
						<FaceRecognition imageUrl={imageUrl} box={boxes} />
					</div>
				: ( route === 'signin'
					?
						<Signin loadUser={ this.loadUser } onRouteChange={this.onRouteChange} />
					:
						<Register loadUser={ this.loadUser } onRouteChange={this.onRouteChange} />
					)
				
				}
			</div>
		);
	}
}

export default App;
