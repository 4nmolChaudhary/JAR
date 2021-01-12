const inspectionDetails = {
	"inspection_id": "",
	"asset_id": "",
	"operator_id": "",
	"operator_name": "John Doe",
	"status": 1,
	"operator_notes": "Completed the inspection. Nothing is Wrong, trailer is good to use ",
	"categoryAttributeList": [
		{
			"category_id": 1,
			"name": "Daily Inspection",
			"form_attributes": [
				{
					"id": "eef43944-d270-471f-bdf9-c40fac822f5a",
					"name": "Clutch",
					"value":"Ok"
				},
				{
					"id": "c17fa137-7b1d-4586-9d49-3a494b388990",
					"name": "Batteries",
					"value": "Ok"
				}
			]
		},
		{
			"category_id": 2,
			"name": "Critical Inspection",
			"form_attributes": [
				{
					"id": "f821d1b9-ea22-437d-a122-5b61d15d224c",
					"name": "Glass",
					"value":"Ok"
				}
			]
		}
	
	],	
	"created_at": "",
	"modified_at": "",
	"created_by": "",
	"modified_by": "",
	"meter_hours": "120",
	"shift": "2",
	"image_list": { "image_names": ["abc.jpg", "test.jpg"] },
	"datetime_requested":"2017-05-24T10:30",
	"Sites": {
		"site_id": "",
		"site_name": "",
		"site_code": "",
		"location": "",
		"status": "",
		"company_id": "",
		"company_name": "",
		"company_code": ""
	},
	"Asset": {
		"asset_id": "",
		"internal_asset_id": "101010",
		"status": "",
		"inspectionform_id": "",
		"created_at": "",
		"modified_at": "",
		"notes": "",
		"asset_request_status": "",
		"asset_requested_by": "",
		"asset_requested_on": "",
		"asset_approved_by": "",
		"asset_approved_on": "",
		"usage": "",
		"meter_hours": "120",
		"name": "Trailer, Dump Clement 37' Scrapstar",
		"asset_type": "",
		"product_name": "",
		"model_name": "",
		"asset_serial_number": "",
		"model_year": "",
		"site_location": "",
		"current_stage": "",
		"parent": "",
		"children": "",
		"AssetTransactionHistory": [
			{
				"asseet_txn_id": "",
				"inspection_id": "",
				"operator_id": "",
				"manager_id": "",
				"attribute_values": {
					"id": "",
					"name": "",
					"value": ""
				},
				"inspection_form_id": "",
				"meter_hours": "",
				"shift": "",
				"created_at": ""
			}]
	}

}
export default inspectionDetails