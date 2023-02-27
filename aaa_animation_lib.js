const theAnimation = function () {
    function init() {
        anim.image = anim.frames[anim.currentFrame];
        anim.frameCount = anim.frames.length;
        anim.width = anim.image.width;
        anim.height = anim.image.height;
        anim.callCounter = anim.frameDurations[anim.currentFrame];
    }
    function update() {
        anim.callCounter--;
        if (anim.callCounter <= 0) {
            anim.currentFrame++;
            if (anim.currentFrame > anim.frameCount - 1)
                anim.currentFrame = 0;
            anim.image = anim.frames[anim.currentFrame];
            anim.callCounter = anim.frameDurations[anim.currentFrame];
        }
    }
    var anim = {

        frames: [],         // array of frames (images)
        frameDurations: [],  // array of durations for every frame
        currentFrame: 0,          // current frame. 
        frameCount: 0,          // number of frames
        image: null,       // the current image at the currentFrame
        width: null,       // width in pixels
        height: null,       // height in pixels
        callCounter: 0,          // counts number of draw calls

        init: init,      // call to initialize
        update: update     // call after drawing picture
    };
    return anim;
}