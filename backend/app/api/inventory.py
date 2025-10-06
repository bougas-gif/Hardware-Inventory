from flask import Blueprint, jsonify, request
from snowflake import execute_query

bp = Blueprint('inventory', __name__)

@bp.route('/api/inventory/<sku>', methods=['GET'])
def get_inventory(sku):
    try:
        # Query to get inventory data
        query = """
        WITH latest_snapshot AS (
            SELECT MAX(snapshot_date) as max_date
            FROM oracle_erp.scm.sq_cloud_item_onhand_detail
        )
        SELECT 
            organization_code as facility,
            subinventory_code,
            total_onhand as quantity,
            available_to_reserve_qty as available_to_reserve,
            reservation_qty as reserved,
            description,
            snapshot_date
        FROM oracle_erp.scm.sq_cloud_item_onhand_detail
        WHERE item_number = %s
        AND snapshot_date = (SELECT max_date FROM latest_snapshot)
        ORDER BY 
            CASE subinventory_code 
                WHEN 'P000' THEN 1
                WHEN 'AVLBL' THEN 2
                WHEN 'SALES' THEN 3
                WHEN 'RETAIL' THEN 4
                WHEN 'SHOP' THEN 5
                WHEN 'WARRANTY' THEN 6
                WHEN 'RETURN' THEN 7
                WHEN 'RETURN-HLD' THEN 8
                WHEN 'UN-AVLBL' THEN 9
                ELSE 10
            END,
            organization_code
        """
        
        result = execute_query({
            "query": query,
            "params": [sku]
        })

        if not result['results']:
            return jsonify({
                'error': 'No inventory found for this SKU'
            }), 404

        # Calculate totals
        totals = {
            'total_quantity': 0,
            'total_available': 0,
            'total_reserved': 0
        }

        for row in result['results']:
            totals['total_quantity'] += row['QUANTITY'] or 0
            totals['total_available'] += row['AVAILABLE_TO_RESERVE'] or 0
            totals['total_reserved'] += row['RESERVED'] or 0

        return jsonify({
            'sku': sku,
            'snapshot_date': result['results'][0]['SNAPSHOT_DATE'],
            'description': result['results'][0]['DESCRIPTION'],
            'inventory': result['results'],
            'totals': totals
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@bp.route('/api/inventory/search', methods=['GET'])
def search_inventory():
    query = request.args.get('q', '')
    if not query:
        return jsonify({
            'error': 'Search query is required'
        }), 400

    try:
        # Query to search for SKUs
        search_query = """
        WITH latest_snapshot AS (
            SELECT MAX(snapshot_date) as max_date
            FROM oracle_erp.scm.sq_cloud_item_onhand_detail
        )
        SELECT DISTINCT
            item_number,
            description
        FROM oracle_erp.scm.sq_cloud_item_onhand_detail
        WHERE snapshot_date = (SELECT max_date FROM latest_snapshot)
        AND (
            UPPER(item_number) LIKE UPPER(%s)
            OR UPPER(description) LIKE UPPER(%s)
        )
        ORDER BY item_number
        LIMIT 10
        """
        
        result = execute_query({
            "query": search_query,
            "params": [f'%{query}%', f'%{query}%']
        })

        return jsonify({
            'results': result['results']
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500
