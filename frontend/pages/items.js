import { ItemsAll } from "../components/ItemsAll";
import React, { Component } from "react";

class home extends Component {
	render() {
		return (
			<div>
				<ItemsAll page={parseFloat(this.props.query.page) || 1} />
			</div>
		);
	}
}

export default home;
