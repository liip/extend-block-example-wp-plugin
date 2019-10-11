import assign from 'lodash.assign';

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, SelectControl } = wp.components;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable spacing control on the following blocks
const enableSpacingControlOnBlocks = [
	'core/image',
];

// Available spacing control options
const spacingControlOptions = [
	{
		label: __( 'None' ),
		value: '',
	},
	{
		label: __( 'Small' ),
		value: 'small',
	},
	{
		label: __( 'Medium' ),
		value: 'medium',
	},
	{
		label: __( 'Large' ),
		value: 'large',
	},
];

/**
 * Add spacing control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addSpacingControlAttribute = ( settings, name ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableSpacingControlOnBlocks.includes( name ) ) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign( settings.attributes, {
		spacingTop: {
			type: 'string',
			default: spacingControlOptions[ 0 ].value,
		},
		spacingBottom: {
			type: 'string',
			default: spacingControlOptions[ 0 ].value,
		},
	} );

	return settings;
};

addFilter( 'blocks.registerBlockType', 'extend-block-example/attribute/spacing', addSpacingControlAttribute );

// Filter out spacing css classes to preserve other additional classes
const removeFromClassName = ( className, classArray ) => {
	console.log( 'AAAAA', className || '' );
	return ( className || '' ).split( ' ' )
		.filter( classString => ! classArray.includes( classString ) )
		.join( ' ' )
		.replace( /\s+/g, ' ' ) // Remove superfluous whitespace
		.trim();
};

/**
 * Create HOC to add spacing control to inspector controls of block.
 */
const withSpacingControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// Do nothing if it's another block than our defined ones.
		if ( ! enableSpacingControlOnBlocks.includes( props.name ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const { className, spacingTop, spacingBottom } = props.attributes;

		const spacings = [
			{
				name: 'top',
				value: spacingTop,
				classes: [ 'has-spacing-top-small', 'has-spacing-top-medium', 'has-spacing-top-large' ],
			},
			{
				name: 'bottom',
				value: spacingBottom,
				classes: [ 'has-spacing-bottom-small', 'has-spacing-bottom-medium', 'has-spacing-bottom-large' ],
			},
		];

		spacings.map( spacing => {
			const classNameWithoutSpacing = removeFromClassName( className, spacing.classes );
			// Add has-spacing-xy class to block
			props.attributes.className = spacing.value ?
				`has-spacing-${ spacing.name }-${ spacing.value } ${ classNameWithoutSpacing }` :
				classNameWithoutSpacing;
		} );

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'My Spacing Controls' ) }
						initialOpen={ true }
					>
						<SelectControl
							label={ __( 'Spacing Top' ) }
							value={ spacingTop }
							options={ spacingControlOptions }
							onChange={ ( selectedSpacingOption ) => {
								props.setAttributes( {
									spacingTop: selectedSpacingOption,
								} );
							} }
						/>
						<SelectControl
							label={ __( 'Spacing Bottom' ) }
							value={ spacingBottom }
							options={ spacingControlOptions }
							onChange={ ( selectedSpacingOption ) => {
								props.setAttributes( {
									spacingBottom: selectedSpacingOption,
								} );
							} }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withSpacingControl' );

addFilter( 'editor.BlockEdit', 'extend-block-example/with-spacing-control', withSpacingControl );

/**
 * Add margin style attribute to save element of block.
 *
 * @param {object} saveElementProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addSpacingExtraProps = ( saveElementProps, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableSpacingControlOnBlocks.includes( blockType.name ) ) {
		return saveElementProps;
	}

	const margins = {
		small: '5px',
		medium: '15px',
		large: '30px',
	};

	if ( attributes.spacingTop in margins ) {
		// Use Lodash's assign to gracefully handle if attributes are undefined
		assign( saveElementProps, { style: { 'margin-top': margins[ attributes.spacingTop ], 'margin-bottom': saveElementProps.style ? saveElementProps.style[ 'margin-top' ] : '' } } );
	}
	if ( attributes.spacingBottom in margins ) {
		// Use Lodash's assign to gracefully handle if attributes are undefined
		assign( saveElementProps, { style: { 'margin-top': saveElementProps.style ? saveElementProps.style[ 'margin-top' ] : '', 'margin-bottom': margins[ attributes.spacingBottom ] } } );
	}

	return saveElementProps;
};

addFilter( 'blocks.getSaveContent.extraProps', 'extend-block-example/get-save-content/extra-props', addSpacingExtraProps );
