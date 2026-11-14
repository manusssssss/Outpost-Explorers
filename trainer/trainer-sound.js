(() => {
  const key = 'outpost-trainer-sound-v1';
  let settings = { enabled: true, volume: 0.35 };
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && typeof saved.enabled === 'boolean') settings.enabled = saved.enabled; if (Number.isFinite(saved?.volume)) settings.volume = Math.max(0, Math.min(1, saved.volume)); } catch {}
  let unlocked = false, previous = null, stepDistance = 0, engine = null;
  const active = new Set();
  const button = document.getElementById('sound-toggle'), panel = document.getElementById('sound-settings');
  const mute = document.getElementById('sound-mute'), volume = document.getElementById('sound-volume');
  function save(){try { localStorage.setItem(key, JSON.stringify(settings)); } catch {}}
  function updateControls(){mute.textContent = settings.enabled ? 'Sound: on' : 'Sound: off'; mute.setAttribute('aria-pressed', String(settings.enabled)); volume.value = String(Math.round(settings.volume * 100)); button.textContent = settings.enabled ? 'Sound' : 'Sound: off';}
  function stopAll(){for(const audio of active){audio.pause();audio.currentTime=0;}active.clear();engine=null;previous=null;stepDistance=0;}
  function play(name, options={}){
    if(!unlocked || !settings.enabled || document.hidden) return null;
    try {
      const audio = new Audio('./assets/sounds/' + name + '.wav');
      audio.dataset.gain = String((options.outside ? .48 : .75) * (options.gain ?? 1));
      audio.volume = Math.max(0, Math.min(1, settings.volume * Number(audio.dataset.gain)));
      audio.loop = !!options.loop; active.add(audio);
      audio.addEventListener('ended', () => active.delete(audio), {once:true});
      const result = audio.play(); if(result?.catch) result.catch(() => {active.delete(audio); if(engine===audio)engine=null;});
      return audio;
    } catch { return null; }
  }
  function stopEngine(){if(engine){engine.pause();active.delete(engine);engine=null;}}
  document.addEventListener('pointerdown', () => {unlocked=true;}, {once:true, capture:true});
  document.addEventListener('keydown', () => {unlocked=true;}, {once:true, capture:true});
  document.addEventListener('visibilitychange', () => {if(document.hidden) stopAll();});
  button.addEventListener('click', () => {panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));});
  mute.addEventListener('click', () => {settings.enabled=!settings.enabled; if(!settings.enabled)stopAll();save();updateControls();});
  volume.addEventListener('input', () => {settings.volume=Number(volume.value)/100; for(const audio of active) audio.volume = Math.min(1,settings.volume*Number(audio.dataset.gain));save();});
  updateControls();
  window.TrainerSound={
    play,
    update({surface, interior, driving, speed, actor}) {
      if(document.hidden || !settings.enabled){stopAll();return;}
      if(!surface){stopEngine();previous=null;stepDistance=0;return;}
      if(driving && Math.abs(speed)>.12){if(!engine)engine=play('engine',{outside:true,loop:true,gain:.6});}else stopEngine();
      if(!actor || driving){previous=null;stepDistance=0;return;}
      const pos=actor.position;
      if(previous && previous.interior===interior){const d=Math.hypot(pos.x-previous.x,pos.z-previous.z);if(d<1.5)stepDistance+=d;else stepDistance=0;if(stepDistance>.85){play('step',{outside:!interior,gain:.8});stepDistance=0;}}
      previous={x:pos.x,z:pos.z,interior};
    },
    stopAll
  };
})();
