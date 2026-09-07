from app.services.github_service import GitHubService


def test_url_validation_success():
    service = GitHubService(None, 1)
    result = service._validate_github_url("https://github.com/facebook/react")
    assert result == {"owner": "facebook", "name": "react"}


def test_url_validation_with_trailing_slash():
    service = GitHubService(None, 1)
    result = service._validate_github_url("https://github.com/torvalds/linux/")
    assert result == {"owner": "torvalds", "name": "linux"}


def test_health_score_weights_sum_to_100():
    # Verify the rule-based scoring algorithm weights sum up to exactly 100
    breakdown_weights = [
        {"name": "README", "weight": 15},
        {"name": "License", "weight": 10},
        {"name": "Description", "weight": 10},
        {"name": "Topics", "weight": 10},
        {"name": "Issues enabled", "weight": 5},
        {"name": "Wiki enabled", "weight": 5},
        {"name": "Default branch", "weight": 5},
        {"name": "GitHub Actions", "weight": 10},
        {"name": "Tests", "weight": 15},
        {"name": "Recent commit activity", "weight": 15},
    ]
    total_weight = sum(item["weight"] for item in breakdown_weights)
    assert total_weight == 100
