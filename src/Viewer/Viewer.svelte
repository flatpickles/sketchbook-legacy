<script>
    import CanvasSketch from './CanvasSketch.svelte';
    import Discloser from './Components/Discloser.svelte';
    import { Direction } from './Components/Types.ts';

    export let sketch;
    export let directLink; // true when viewer started with a specific sketch
    let sketchComponent;
    let viewportWidth;
    $: viewportWidthString = viewportWidth + "px";

    export function update() {
        sketchComponent.update();
    }

    let storedLeftPanelState = localStorage.getItem('leftPanelOpen');
    let leftPanelOpen = storedLeftPanelState ? (storedLeftPanelState === 'true') : true;
    function toggleLeft() {
        leftPanelOpen = !leftPanelOpen;
        localStorage.setItem('leftPanelOpen', leftPanelOpen ? 'true' : 'false');
        preventPanelCollision(false);
    }

    let storedRightPanelState = localStorage.getItem('rightPanelOpen');
    let rightPanelOpen = storedRightPanelState ? (storedRightPanelState === 'true') : true;
    function toggleRight() {
        rightPanelOpen = !rightPanelOpen;
        localStorage.setItem('rightPanelOpen', rightPanelOpen ? 'true' : 'false');
        preventPanelCollision(true);
    }

    // Double click: hide panels if either is open, show if both are closed
    function viewportClicked(event) {
        if (event.detail == 2) {
            if (rightPanelOpen || leftPanelOpen) {
                if (rightPanelOpen) toggleRight();
                if (leftPanelOpen) toggleLeft();
            } else {
                toggleRight();
                toggleLeft();
            }
        }
    }

    // Only allow one open panel at a time for narrow screens
    preventPanelCollision(directLink);
    function preventPanelCollision(preferRight = false) {
        // todo: fix hardcoded width threshold
        if (leftPanelOpen && rightPanelOpen && window.innerWidth < 600) {
            leftPanelOpen = !preferRight;
            rightPanelOpen = preferRight;
            localStorage.setItem('leftPanelOpen', leftPanelOpen ? 'true' : 'false');
            localStorage.setItem('rightPanelOpen', rightPanelOpen ? 'true' : 'false');
        }
    }

    // Check panels again when the document becomes visible (i.e. tab is selected)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') preventPanelCollision();
    });

    // Prevent right bar position from animating immediately after a window resize event
    window.addEventListener('resize', function(event) {
        // Remove the class with the transition before the animation can roll
        document.getElementById('right_panel').classList.remove('right_transition');
        // Add it back on the next DOM update - goofy but daaang it looks fresh
        setTimeout(() => {
            document.getElementById('right_panel').classList.add('right_transition');
        }, 0);
        // Adjust panels if need be
        preventPanelCollision();
    }, true);

    // Provide properties that can be used for fading open/close buttons in & out
    const isTouchDevice = ('ontouchstart' in window) ||
                          (navigator.maxTouchPoints > 0) ||
                          (navigator.msMaxTouchPoints > 0);
    
    const mouseMoveTimeoutDuration = 2000; // milliseconds
    let mouseMoveTimeout = undefined;
    let mouseIsMoving = false;
    document.onmousemove = () => {
        mouseIsMoving = true;
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            mouseIsMoving = false;
        }, mouseMoveTimeoutDuration);
    };
    
</script>

<div id='left_panel' class='panel' class:open={leftPanelOpen}>
    <div class='panel_content'>
        <slot name='left'>
        </slot>
    </div>
    <div class='button_container'>
        <div class='panel_button' on:click={toggleLeft} on:keypress={toggleLeft} class:opaque={mouseIsMoving || isTouchDevice}>
            <Discloser
                direction={Direction.Left}
                borderStyle={true}
                size={16}
                id="left"
                bind:open={leftPanelOpen}
            />
        </div>
    </div>
</div>

<div class='viewport' bind:clientWidth={viewportWidth} on:click={viewportClicked} on:keypress={viewportClicked}>
    <CanvasSketch {sketch} bind:this={sketchComponent} />
</div>

<div id='right_panel' class='panel right_transition' class:open={rightPanelOpen} style='--viewport-width: {viewportWidthString}'>
    <div class='button_container'>
        <div class='panel_button' on:click={toggleRight} on:keypress={toggleRight} class:opaque={mouseIsMoving || isTouchDevice}>
            <Discloser
                direction={Direction.Right}
                borderStyle={true}
                size={16}
                id="right"
                bind:open={rightPanelOpen}
            />
        </div>
    </div>
    <div class='panel_content'>
        <slot name='right'>
        </slot>
    </div>
</div>

<style>
    .viewport {
        width: 100%;
        height: 100%;
        background-color: #0000;
    }

    .panel {
        position: fixed;
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 300px;
        z-index: 10;
    }

    .panel_content {
        flex-grow: 1;
        background-color: var(--panel-background);
        backdrop-filter: var(--panel-filter);
        -webkit-backdrop-filter: var(--panel-filter);
    }

    .button_container {
        width: 50px;
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        height: fit-content;
    }

    .panel_button {
        cursor: pointer;
        padding: var(--collapse-tab-padding);
        text-align: center;
        flex-shrink: 2;
        user-select: none;

        /* opacity: 0.0 when panel is closed, 0.2 when open, 0.7 when has class `opaque` */
        opacity: 0.0;
        transition: opacity var(--animation-time) ease-out;
    }

    .panel.open .panel_button:not(.opaque) {
        opacity: 0.2;
    }

    .panel_button.opaque, .panel_button:hover {
        opacity: 0.7;
    }

    /* Left panel */

    #left_panel {
        left: -250px;
        transition: left var(--animation-time) ease-in-out;
    }

    #left_panel.open {
        left: 0px
    }

    #left_panel .button_container {
        justify-content: flex-start;
    }

    #left_panel .panel_content {
        border-right: var(--border);
    }

    /* Right panel */

    #right_panel {
        left: calc(var(--viewport-width) - 50px);
    }

    .right_transition {
        transition: left var(--animation-time) ease-in-out;
    }

    #right_panel.open {
        left: calc(var(--viewport-width) - 300px);
    }

    #right_panel .button_container {
        justify-content: flex-end;
    }

    #right_panel .panel_content {
        border-left: var(--border);
    }
</style>