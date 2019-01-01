import React, { Component } from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { perPage } from "../config";
import Head from "next/head";
import Link from "next/link";

const PAGINATION_QUERY = gql`
	query PAGINATION_QUERY {
		itemsConnection {
			aggregate {
				count
			}
		}
	}
`;

export class Pagination extends Component {
	render() {
		return (
			<Query query={PAGINATION_QUERY}>
				{({ data, loading, error }) => {
					if (loading) return <p>Loading</p>;
					const count = data.itemsConnection.aggregate.count;
					const pages = Math.ceil(count / perPage);
					return (
						<PaginationStyles>
							<Head>
								<title>Sick Fits | Page {this.props.page}</title>
							</Head>
							<Link
								prefetch
								href={{
									pathname: "items",
									query: { page: this.props.page - 1 }
								}}
							>
								<a className="prev" aria-disabled={this.props.page <= 1}>
									Prev
								</a>
							</Link>
							<p>
								{this.props.page} of {pages}
							</p>
							<p>{count} Items Total</p>
							<Link
								prefetch
								href={{
									pathname: "items",
									query: { page: this.props.page + 1 }
								}}
							>
								<a className="next" aria-disabled={this.props.page >= pages}>
									Next
								</a>
							</Link>
						</PaginationStyles>
					);
				}}
			</Query>
		);
	}
}
