from pathlib import Path

from hermes_plugin.schemas import TOOL_SCHEMAS
from hermes_plugin.tools import TOOL_HANDLERS


def register(ctx):
    for name, schema in TOOL_SCHEMAS.items():
        ctx.register_tool(
            name=name,
            toolset="youtube_intelligence",
            schema=schema,
            handler=TOOL_HANDLERS[name],
        )

    skills_root = Path(__file__).resolve().parent.parent / "skills"
    for skill_dir in skills_root.iterdir() if skills_root.exists() else []:
        skill_file = skill_dir / "SKILL.md"
        if skill_file.exists():
            ctx.register_skill(skill_dir.name, skill_file)
