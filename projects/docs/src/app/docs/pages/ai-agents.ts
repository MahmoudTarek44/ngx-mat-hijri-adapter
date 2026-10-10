import { Component } from '@angular/core';

import { CodeBlock } from '../../shared/code-block';

const INSTALL_SKILL = `mkdir -p .cursor/skills/ngx-mat-hijri-adapter
cp node_modules/ngx-mat-hijri-adapter/agents/SKILL.md .cursor/skills/ngx-mat-hijri-adapter/SKILL.md`;

@Component({
  selector: 'ai-agents',
  imports: [CodeBlock],
  templateUrl: './ai-agents.html',
})
export class AiAgents {
  protected readonly installSkill = INSTALL_SKILL;
}
