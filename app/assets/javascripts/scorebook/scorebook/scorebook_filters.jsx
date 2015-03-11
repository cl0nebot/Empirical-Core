EC.ScorebookFilters = React.createClass({
	selectOption: function () {
		console.log('select option')
	},

	render: function () {
		return (
			<div className="row activity-page-dropdown-wrapper">
				<div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
					<EC.DropdownFilter 
						options={this.props.classroomFilters}
						selectOption={this.props.selectClassroom}
						defaultOption={this.props.defaultClassroom} />
				</div>
				<div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
					<EC.DropdownFilter
						options={this.props.unitFilters}
						selectOption={this.props.selectUnit}
						defaultOption={this.props.defaultUnit}/>
				</div>
			</div>
		);
	}


});


