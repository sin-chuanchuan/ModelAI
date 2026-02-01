import pytest
import httpx
try:
    from unittest.mock import patch, MagicMock, AsyncMock
except ImportError:
    # Python 3.7 适配
    from mock import patch, MagicMock, AsyncMock

from app.services.ai.doubao_service import DoubaoAIService

@pytest.mark.asyncio
async def test_doubao_generate_image_async_structure():
    """
    测试豆包服务的异步结构是否正确
    """
    # 注入模拟 API Key 避免 Header 报错
    with patch('os.getenv', return_value="test_key"):
        service = DoubaoAIService()
        prompt = "A beautiful sunset"
        
        mock_response_data = {
            "data": [
                {"url": "http://test.com/image.png"}
            ]
        }
        
        # 修正：使用 patch 模拟 httpx.AsyncClient 中的方法
        with patch('httpx.AsyncClient.post', new_callable=AsyncMock) as mock_post:
            mock_response = MagicMock(spec=httpx.Response)
            mock_response.status_code = 200
            mock_response.json.return_value = mock_response_data
            mock_post.return_value = mock_response
            
            result = await service.generate_image(prompt)
            
            assert result["image_url"] == "http://test.com/image.png"

            assert result["model"] == "doubao-seedream-4-5-251128"
            mock_post.assert_awaited_once()
        
    print("\n✅ 异步结构测试通过")

@pytest.mark.asyncio
async def test_doubao_uses_httpx_async():
    """
    验证是否使用了 httpx 进行异步请求
    """
    with patch('os.getenv', return_value="test_key"):
        service = DoubaoAIService()
        
        # 模拟 httpx.AsyncClient.post
        with patch('httpx.AsyncClient.post', new_callable=AsyncMock) as mock_async_post:
            mock_response = MagicMock(spec=httpx.Response)
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "data": [{"url": "http://test.com/async_image.png"}]
            }
            mock_async_post.return_value = mock_response
            
            result = await service.generate_image("Modern architecture")
            
            assert result["image_url"] == "http://test.com/async_image.png"
            mock_async_post.assert_awaited_once()

