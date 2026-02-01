import pytest
try:
    from unittest.mock import patch, MagicMock, AsyncMock
except ImportError:
    from mock import patch, MagicMock, AsyncMock

from app.services.ai.openai_service import OpenAIService


@pytest.mark.asyncio
async def test_openai_generate_image_async():
    """验证 OpenAI 服务是否正确使用了异步调用"""
    with patch('os.getenv', return_value="sk-test-key"):
        service = OpenAIService()
        prompt = "A futuristic city"
        
        # 模拟 OpenAI 异步客户端行为
        # 结构: client.images.generate -> 返回包含 data[0].url 的对象
        mock_response = MagicMock()
        mock_image = MagicMock()
        mock_image.url = "http://test.com/openai.png"
        mock_response.data = [mock_image]
        
        with patch('openai.AsyncOpenAI') as mock_client_class:
            mock_client_instance = mock_client_class.return_value
            mock_client_instance.images.generate = AsyncMock(return_value=mock_response)
            
            # 重新实例化以触发新的 client 创建 (或者在代码中已经使用了单例)
            # 在我们的重构中，client 将在 __init__ 中创建
            service.client = mock_client_instance
            
            result = await service.generate_image(prompt)
            
            assert result["image_url"] == "http://test.com/openai.png"
            assert result["model"] == "dall-e-3"
            mock_client_instance.images.generate.assert_awaited_once()

@pytest.mark.asyncio
async def test_openai_config_integration():
    """验证服务是否正确使用了配置对象"""
    from config import config
    with patch('os.getenv', return_value=None):
        with patch.object(config, 'OPENAI_API_KEY', "config-test-key"):
            service = OpenAIService()
            assert service.api_key == "config-test-key"
