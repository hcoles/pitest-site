function easeOutBounce(x) {
    var base = -Math.cos(x * (0.5 * Math.PI)) + 1;
    var rate = Math.pow(base, 1.5);
    var rateR = Math.pow(1 - x, 2);
    var progress = -Math.abs(Math.cos(rate * (2.5 * Math.PI))) + 1;
    return (1 - rateR) + (progress * rateR);
}
var timing,
    timingProps = {
        type: 'delayed',
        duration: 150,
        start: 'autostart',
        pathTimingFunction: Vivus.LINEAR,
        animTimingFunction: Vivus.LINEAR
    };

function timingTest(buttonEl, property, type) {
    var activeSibling = buttonEl.parentNode.querySelector('button.active');
    activeSibling.classList.remove('active');
    buttonEl.classList.add('active');
    timingProps.type = (property === 'type') ? type : timingProps.type;
    timingProps.pathTimingFunction = (property === 'path') ? Vivus[type] : timingProps.pathTimingFunction;
    timingProps.animTimingFunction = (property === 'anim') ? Vivus[type] : timingProps.animTimingFunction;
    timing && timing.stop().destroy();
    timing = new Vivus('timing-example', timingProps);
}
var hi = new Vivus('hi-there', {
        type: 'oneByOne',
        duration: 120,
        start: 'autostart',
        dashGap: 20,
        forceRender: false
    }, function() {
        if (window.console) {
            console.log('Animation finished. [log triggered from callback]');
        }
    }),
    bug = new Vivus('bug', {
        type: 'oneByOne',
        duration: 150
    }),
    maven = new Vivus('maven', {
        type: 'oneByOne',
        duration: 150
    }),
    watch = new Vivus('watch', {
        type: 'delayed',
        duration: 150
    }),
    obt3 = new Vivus('gradle', {
        type: 'oneByOne',
        duration: 150
    }),
    eclipse = new Vivus('eclipse', {
        type: 'scenario-sync',
        duration: 20,
        forceRender: false
    });
intelij = new Vivus('intellij', {
    type: 'oneByOne',
    duration: 160
});
tree = new Vivus('tree', {
    type: 'oneByOne',
    duration: 160
});
uncleBob = new Vivus('unclebob', {
    type: 'delayed',
    duration: 300
});
henry = new Vivus('henry', {
    type: 'delayed',
    duration: 300
});
sky = new Vivus('sky', {
    type: 'delayed',
    duration: 150
});