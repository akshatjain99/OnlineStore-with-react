import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import styled from "styled-components";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Router from "next/router";

const CREATE_ITEM_MUTAION = gql`
	mutation CREATE_ITEM_MUTAION(
		$title: String!
		$description: String!
		$image: String
		$largeImage: String
		$price: Int!
	) {
		createItem(
			title: $title
			description: $description
			image: $image
			largeImage: $largeImage
			price: $price
		) {
			id
		}
	}
`;

export class CreateItem extends Component {
	state = {
		title: "",
		description: "",
		image: "",
		largeImage: "",
		price: 0
	};

	handleChange = event => {
		const { name, type, value } = event.target;
		const val = type === "number" ? parseFloat(value) : value;
		this.setState({
			[name]: val
		});
	};

	uploadFile = async event => {
		const files = event.target.files;
		const data = new FormData();
		data.append("file", files[0]);
		data.append("upload_preset", "sickfits");
		const res = await fetch(
			"https://api.cloudinary.com/v1_1/doiqmhyyj/image/upload",
			{
				method: "POST",
				body: data
			}
		);
		const file = await res.json();
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url
		});
	};

	render() {
		return (
			<Mutation mutation={CREATE_ITEM_MUTAION} variables={this.state}>
				{(createItem, { loading, error }) => (
					<Form
						onSubmit={async event => {
							event.preventDefault();
							const res = await createItem();
							Router.push({
								pathname: "/item",
								query: { id: res.data.createItem.id }
							});
						}}
					>
						<Error error={error} />
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor="file">
								Image
								<input
									type="file"
									id="file"
									name="file"
									placeholder="Upload Image"
									required
									onChange={this.uploadFile}
								/>
								{this.state.image && (
									<img
										width="200"
										src={this.state.image}
										alt={this.state.title}
									/>
								)}
							</label>
							<label htmlFor="title">
								Title
								<input
									type="text"
									id="title"
									name="title"
									placeholder="Title"
									required
									value={this.state.title}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor="price">
								Price
								<input
									type="number"
									id="price"
									name="price"
									placeholder="price"
									required
									value={this.state.price}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor="description">
								Description
								<textarea
									id="description"
									name="description"
									placeholder="description"
									required
									value={this.state.description}
									onChange={this.handleChange}
								/>
							</label>
							<button type="submit">Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export { CREATE_ITEM_MUTAION };
