import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./ItemsAll";

const DELETE_ITEM_MUTATION = gql`
	mutation DELETE_ITEM_MUTATION($id: ID!) {
		deleteItem(id: $id) {
			id
		}
	}
`;

export class DeleteItem extends Component {
	update = (cache, payload) => {
		//Read the cache for the files we want - i.e. all the items like we do in ItemsAll
		const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
		//Take the deleted item out of page
		data.items = data.items.filter(
			item => item.id != payload.data.deleteItem.id
		);
		cache.writeQuery({ query: ALL_ITEMS_QUERY, data: data });
	};

	render() {
		return (
			<Mutation
				mutation={DELETE_ITEM_MUTATION}
				variables={{ id: this.props.id }}
				update={this.update}
			>
				{(deleteItem, { loading, error }) => {
					if (loading) return <p>Loading....</p>;
					return (
						<button
							onClick={() => {
								if (confirm("Are you sure?")) {
									deleteItem();
								}
							}}
						>
							Delete
						</button>
					);
				}}
			</Mutation>
		);
	}
}
