<script>
    
</script>

<div id='preset_selector'>
    <div id='select_container'>
        <select>
            <option value="0">Default Values</option>
            <option value="1">Audi</option>
            <option value="2">BMW</option>
            <option value="3">Citroen</option>
            <option value="4">Ford</option>
            <option value="5">Honda</option>
            <option value="6">Jaguar</option>
            <option value="7">Land Rover</option>
            <option value="8">Mercedes</option>
            <option value="9">Mini</option>
            <option value="10">Nissan</option>
            <option value="11">Toyota</option>
            <option value="12">Volvo</option>
        </select>
    </div>
    <div id='new_button'>
        +
    </div>
</div>

<style>
    #preset_selector {
        border-top: var(--border);
        padding: 0;
        font-size: var(--description-font-size);
        display: flex;
        align-items: baseline;
    }

    #select_container {
        flex-grow: 1;
        flex-shrink: 0;
    }

    select {
        appearance: none;
        border: 0;
        background: #0000;
        margin: 0;
        padding: var(--spacing);
        width: 100%;
    }

    select:focus {
        outline: 0;
        flex-shrink: 0;
        flex-grow: 0;
    }

    #new_button {
        padding: var(--spacing);
        text-align: right;
        
    }
</style>
