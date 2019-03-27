import { assign } from 'lodash';

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, SelectControl } = wp.components;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable spacing control on the following blocks
const enableSpacingControlOnBlocks = [
	'core/image',
]

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
 * @returns {object}
 */
const addSpacingControlAttribute = ( settings, name ) => {
	if ( ! enableSpacingControlOnBlocks.includes( name ) ) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign( settings.attributes, {
		spacing: {
			type: 'string',
			default: spacingControlOptions[0].value,
		},
	} );

	return settings;
}

addFilter( 'blocks.registerBlockType', 'extend-block-example/attribute/spacing', addSpacingControlAttribute );

/**
 * Create HOC to add spacing control to inspector controls of block.
 */
const withSpacingControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! enableSpacingControlOnBlocks.includes( props.name ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const { spacing } = props.attributes;

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'My Spacing Control' ) }
						initialOpen={ true }
					>
						<SelectControl
							label={ __( 'Spacing' ) }
							value={ spacing }
							options={ spacingControlOptions }
							onChange={ ( selectedSpacingOption ) => {
								props.setAttributes( {
									spacing: selectedSpacingOption,
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
 * @returns {object}
 */
const addSpacingExtraProps = ( saveElementProps, blockType, attributes ) => {
	if ( ! enableSpacingControlOnBlocks.includes( blockType.name ) ) {
		return saveElementProps;
	}

	const margins = {
		small: '5px',
		medium: '15px',
		large: '30px',
	};

	if( attributes.spacing in margins ) {
		// Use Lodash's assign to gracefully handle if attributes are undefined
		lodash.assign( saveElementProps, { style: { 'margin-bottom': margins[ attributes.spacing ] } } );
	}

	return saveElementProps;
}

addFilter( 'blocks.getSaveContent.extraProps', 'extend-block-example/get-save-content/extra-props', addSpacingExtraProps );
