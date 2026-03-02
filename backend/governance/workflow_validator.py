""" Strict workflow validator created to validate
wrokflow definitions created by LLM before saving to DB"""
# workflow definition validatoe (scalable)
ALLOWED_AGENTS = {"hr", "approval", "it", "laptop_selection", "procurement"}
ALLOWED_TYPES = {"agent", "human"}
MAX_NODES = 10
MAX_HUMAN_NODES = 2

EXPECTED_ORDER = ["hr", "approval", "it", "laptop_selection", "procurement"]

def validate_workflow(definition: dict):

    if "nodes" not in definition:
        raise Exception("Workflow definition must contain 'nodes' key")
    
    nodes  = definition["nodes"]
    
    if not isinstance(nodes, list):
        raise Exception(" 'nodes' key must be list in workflow definition")
    
    if len(nodes) > MAX_NODES:
        raise Exception("Workflow cannot contain more than 10 Agent nodes")
    
    human_count = 0
    node_ids = []
    
    for node in nodes:
        if "id" not in node or "type" not in node:
            raise Exception("Each node must contain 'id' and 'type'")
        
        if node["id"] not in ALLOWED_AGENTS:
            raise Exception(f"Unauthorized agent: {node['id']}")
        
        if node["type"] not in ALLOWED_TYPES:
            raise Exception(f"Invalid type: {node['type']}")
        
        if node["type"] == "human":
            human_count += 1
            
        node_ids.append(node["id"])
        
    if human_count > MAX_HUMAN_NODES:
        raise Exception("Workflow cannot contain more than 2 human nodes")
    
    # Enforce expected order of agents if multiple nodes are present
    if node_ids != EXPECTED_ORDER:
        raise Exception(f"Nodes must be in the following order if multiple are present: {EXPECTED_ORDER}")